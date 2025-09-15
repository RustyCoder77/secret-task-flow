import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface TaskColumnProps {
  title: string;
  count: number;
  status: 'todo' | 'in-progress' | 'completed';
  children: ReactNode;
}

const TaskColumn = ({ title, count, status, children }: TaskColumnProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'todo':
        return 'bg-muted/50 text-muted-foreground';
      case 'in-progress':
        return 'bg-dao-blue/20 text-dao-blue border-dao-blue/30';
      case 'completed':
        return 'bg-dao-success/20 text-dao-success border-dao-success/30';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <Badge className={`${getStatusColor()}`}>
          {count}
        </Badge>
      </div>
      
      <div className="min-h-[200px] space-y-4">
        {children}
      </div>
    </div>
  );
};

export default TaskColumn;