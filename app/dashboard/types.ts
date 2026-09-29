export type Agent = {
  id: string;
  name: string;
  color: string;
  status: "working" | "waiting";
  currentTask: string;
  progress: number;
};

export type TaskItem = {
  id: string;
  title: string;
  done: boolean;
  agentId: string | null;
  createdAt: string;
};

export type ActivityItem = {
  id: string;
  text: string;
  agentName: string | null;
  color: string | null;
  createdAt: string;
};

export function timeAgo(iso: string): string {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  return new Date(iso).toLocaleDateString();
}
