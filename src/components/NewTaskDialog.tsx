import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  estimatedHours: number;
  tags: string[];
  status: 'todo' | 'in-progress' | 'completed';
  assignedTo?: string;
}

interface NewTaskDialogProps {
  onTaskCreate: (task: Omit<Task, 'id' | 'status' | 'assignedTo'>) => void;
}

const NewTaskDialog = ({ onTaskCreate }: NewTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    deadline: '',
    estimatedHours: 1,
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    const newTask = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      deadline: formData.deadline,
      estimatedHours: formData.estimatedHours,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };

    onTaskCreate(newTask);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      deadline: '',
      estimatedHours: 1,
      tags: ''
    });
    
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2 bg-gradient-primary hover:opacity-90 transition-smooth">
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new anonymous task to the board. Contributors can claim tasks without revealing their identity.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the task requirements..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: 'low' | 'medium' | 'high') => handleInputChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.estimatedHours}
                onChange={(e) => handleInputChange('estimatedHours', parseFloat(e.target.value) || 1)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="e.g. Frontend, Design, Smart Contracts (comma separated)"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:opacity-90">
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;