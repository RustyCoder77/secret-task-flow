import { useState, useEffect } from "react";
import { useAccount } from 'wagmi';
import { useSecretTaskFlow } from '../hooks/useContract';
import TaskCard from "./TaskCard";
import TaskColumn from "./TaskColumn";
import NewTaskDialog from "./NewTaskDialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Wallet } from "lucide-react";

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

// Mock data for initial tasks
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Smart Contract Audit',
    description: 'Review the voting mechanism smart contract for security vulnerabilities and gas optimization opportunities.',
    priority: 'high',
    deadline: 'Oct 25, 2024',
    estimatedHours: 8,
    tags: ['Security', 'Smart Contracts', 'Solidity'],
    status: 'todo',
    assignedTo: 'contributor-1'
  },
  {
    id: '2',
    title: 'UI/UX Design System',
    description: 'Create a comprehensive design system for the DAO platform including components, colors, and typography.',
    priority: 'medium',
    deadline: 'Oct 30, 2024',
    estimatedHours: 12,
    tags: ['Design', 'Frontend', 'Figma'],
    status: 'in-progress',
    assignedTo: 'contributor-2'
  },
  {
    id: '3',
    title: 'Documentation Update',
    description: 'Update the README and technical documentation to reflect recent changes to the governance protocol.',
    priority: 'low',
    deadline: 'Nov 5, 2024',
    estimatedHours: 4,
    tags: ['Documentation', 'Technical Writing'],
    status: 'completed',
    assignedTo: 'contributor-3'
  },
  {
    id: '4',
    title: 'Token Economics Research',
    description: 'Research and propose improvements to the current tokenomics model based on similar successful DAOs.',
    priority: 'high',
    deadline: 'Oct 28, 2024',
    estimatedHours: 16,
    tags: ['Research', 'Tokenomics', 'Economics'],
    status: 'todo',
    assignedTo: 'contributor-4'
  },
  {
    id: '5',
    title: 'Mobile App Prototype',
    description: 'Create a mobile-first prototype for DAO voting and proposal management on iOS and Android.',
    priority: 'medium',
    deadline: 'Nov 15, 2024',
    estimatedHours: 20,
    tags: ['Mobile', 'React Native', 'Prototype'],
    status: 'in-progress',
    assignedTo: 'contributor-5'
  }
];

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const { address, isConnected } = useAccount();
  const { isRegistered, registerContributor } = useSecretTaskFlow();

  const handleStatusChange = (taskId: string, newStatus: 'todo' | 'in-progress' | 'completed') => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleTaskCreate = (taskData: Omit<Task, 'id' | 'status' | 'assignedTo'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      status: 'todo',
      assignedTo: `contributor-${Math.floor(Math.random() * 10) + 1}`
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleRegister = () => {
    if (registerContributor) {
      registerContributor({
        args: ['encrypted-profile-data'], // This would be actual encrypted data
      });
    }
  };

  const getTasksByStatus = (status: 'todo' | 'in-progress' | 'completed') => {
    return tasks.filter(task => task.status === status);
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Alert className="max-w-md mx-auto">
          <Wallet className="h-4 w-4" />
          <AlertDescription>
            Please connect your wallet to access the task board.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Alert className="max-w-md mx-auto">
          <Shield className="h-4 w-4" />
          <AlertDescription className="mb-4">
            You need to register as a contributor to access the task board.
          </AlertDescription>
          <Button onClick={handleRegister} className="w-full">
            Register as Contributor
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Task Board</h2>
          <p className="text-muted-foreground mt-1">
            Manage anonymous task assignments and track progress
          </p>
        </div>
        
        <NewTaskDialog onTaskCreate={handleTaskCreate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaskColumn
          title="To Do"
          count={getTasksByStatus('todo').length}
          status="todo"
        >
          {getTasksByStatus('todo').map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
            />
          ))}
        </TaskColumn>

        <TaskColumn
          title="In Progress"
          count={getTasksByStatus('in-progress').length}
          status="in-progress"
        >
          {getTasksByStatus('in-progress').map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
            />
          ))}
        </TaskColumn>

        <TaskColumn
          title="Completed"
          count={getTasksByStatus('completed').length}
          status="completed"
        >
          {getTasksByStatus('completed').map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
            />
          ))}
        </TaskColumn>
      </div>
    </div>
  );
};

export default TaskBoard;