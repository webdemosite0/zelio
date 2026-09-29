import { neon } from "@neondatabase/serverless";

function sql() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");
  return neon(process.env.DATABASE_URL);
}

const TEAM = [
  ["Strategy", "#FFCB45"], ["Research", "#25E6DA"], ["Product", "#B642FF"],
  ["Development", "#258BFF"], ["Marketing", "#FF3E9D"], ["Sales", "#FF7657"],
] as const;

export type DbAgent = { id:string; name:string; color:string; status:"working"|"waiting"; currentTask:string; progress:number };
export type DbTask = { id:string; title:string; done:boolean; agentId:string|null; createdAt:string };
export type DbActivity = { id:string; text:string; agentName:string|null; color:string|null; createdAt:string };

async function companyFor(userId:string) {
  const q=sql();
  const rows=await q`insert into companies (owner_user_id, name) values (${userId}, 'My company')
    on conflict (owner_user_id) do update set updated_at=now() returning id`;
  const companyId=String(rows[0].id);
  const count=await q`select count(*)::int as n from agents where company_id=${companyId}`;
  if(Number(count[0].n)===0) {
    for(const [role,accent] of TEAM) await q`insert into agents (company_id,role,status,current_task,progress,accent) values (${companyId},${role},'working','Ready for your next command',0,${accent})`;
  }
  return companyId;
}

const agent=(r:Record<string,unknown>):DbAgent=>({id:String(r.id),name:String(r.role),color:String(r.accent),status:r.status==="waiting"?"waiting":"working",currentTask:String(r.current_task??""),progress:Number(r.progress??0)});
const task=(r:Record<string,unknown>):DbTask=>({id:String(r.id),title:String(r.title),done:r.status==="done",agentId:r.agent_id?String(r.agent_id):null,createdAt:new Date(String(r.created_at)).toISOString()});
const activity=(r:Record<string,unknown>):DbActivity=>({id:String(r.id),text:String(r.message),agentName:r.kind?String(r.kind):null,color:null,createdAt:new Date(String(r.created_at)).toISOString()});

export const db={
 async listAgents(userId:string){const q=sql(),c=await companyFor(userId);return (await q`select * from agents where company_id=${c} order by created_at`).map(r=>agent(r as Record<string,unknown>));},
 async getAgentById(userId:string,id:string){const q=sql(),c=await companyFor(userId);const r=await q`select * from agents where id=${id} and company_id=${c} limit 1`;return r[0]?agent(r[0] as Record<string,unknown>):null;},
 async updateAgent(userId:string,id:string,data:{status?:"working"|"waiting";progress?:number;currentTask?:string}){const q=sql(),c=await companyFor(userId);const old=await this.getAgentById(userId,id);if(!old)return null;const status=data.status??old.status,progress=data.progress??old.progress,currentTask=data.currentTask??old.currentTask;const r=await q`update agents set status=${status},progress=${progress},current_task=${currentTask} where id=${id} and company_id=${c} returning *`;return r[0]?agent(r[0] as Record<string,unknown>):null;},
 async listTasks(userId:string){const q=sql(),c=await companyFor(userId);return (await q`select * from tasks where company_id=${c} order by created_at`).map(r=>task(r as Record<string,unknown>));},
 async getTaskById(userId:string,id:string){const q=sql(),c=await companyFor(userId);const r=await q`select * from tasks where id=${id} and company_id=${c} limit 1`;return r[0]?task(r[0] as Record<string,unknown>):null;},
 async createTask(userId:string,title:string,agentId?:string|null){const q=sql(),c=await companyFor(userId);const r=await q`insert into tasks(company_id,agent_id,title,status,priority,progress) values(${c},${agentId??null},${title},'todo','medium',0) returning *`;return task(r[0] as Record<string,unknown>);},
 async setTaskDone(userId:string,id:string,done:boolean){const q=sql(),c=await companyFor(userId);const r=await q`update tasks set status=${done?"done":"todo"},progress=${done?100:0},updated_at=now() where id=${id} and company_id=${c} returning *`;return r[0]?task(r[0] as Record<string,unknown>):null;},
 async deleteTask(userId:string,id:string){const q=sql(),c=await companyFor(userId);const r=await q`delete from tasks where id=${id} and company_id=${c} returning id`;return r.length>0;},
 async addActivity(userId:string,text:string,agentName?:string|null){const q=sql(),c=await companyFor(userId);const r=await q`insert into activity(company_id,kind,message) values(${c},${agentName??"ZELIO"},${text}) returning *`;return activity(r[0] as Record<string,unknown>);},
 async listActivity(userId:string,limit=20){const q=sql(),c=await companyFor(userId);const n=Math.max(1,Math.min(50,limit));const rows=await q`select * from activity where company_id=${c} order by created_at desc limit ${n}`;return rows.map(r=>activity(r as Record<string,unknown>));},
};
