import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User } from "lucide-react";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    deadline: string;
    estimatedHours: number;
    tags: string[];
    status: 'todo' | 'in-progress' | 'completed';
    assignedTo?: string; // This will be hidden
  };
  onStatusChange: (taskId: string, newStatus: 'todo' | 'in-progress' | 'completed') => void;
}

const TaskCard = ({ task, onStatusChange }: TaskCardProps) => {
  const priorityColors = {
    low: 'bg-dao-success/20 text-dao-success border-dao-success/30',
    medium: 'bg-dao-warning/20 text-dao-warning border-dao-warning/30',
    high: 'bg-destructive/20 text-destructive border-destructive/30'
  };

  const getStatusAction = () => {
    switch (task.status) {
      case 'todo':
        return { text: 'Start Task', newStatus: 'in-progress' as const };
      case 'in-progress':
        return { text: 'Complete', newStatus: 'completed' as const };
      case 'completed':
        return { text: 'Reopen', newStatus: 'todo' as const };
    }
  };

  const statusAction = getStatusAction();

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-smooth group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth">
            {task.title}
          </h3>
          <Badge className={`text-xs ${priorityColors[task.priority]}`}>
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {task.description}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs bg-secondary/50 text-secondary-foreground/80"
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <User className="h-3 w-3" />
            <span>Anonymous Contributor</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3" />
            <span>{task.deadline}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-3 w-3" />
            <span>{task.estimatedHours}h estimated</span>
          </div>
        </div>
        
        <Button 
          onClick={() => onStatusChange(task.id, statusAction.newStatus)}
          size="sm"
          variant={task.status === 'completed' ? 'outline' : 'default'}
          className="w-full mt-4 transition-bounce"
        >
          {statusAction.text}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaskCard;