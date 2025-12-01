import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface AssignedEmployee {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface AssignedEmployeesProps {
  employees: AssignedEmployee[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  showNames?: boolean;
}

export const AssignedEmployees = ({ 
  employees, 
  maxDisplay = 4, 
  size = 'md',
  showNames = true 
}: AssignedEmployeesProps) => {
  const displayedEmployees = employees.slice(0, maxDisplay);
  const remainingCount = employees.length - maxDisplay;

  const sizeClasses = {
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-8 w-8 text-xs',
    lg: 'h-10 w-10 text-sm',
  };

  const overlapClasses = {
    sm: '-ml-2',
    md: '-ml-3',
    lg: '-ml-4',
  };

  // Single employee display
  if (employees.length === 1) {
    const employee = employees[0];
    return (
      <div className="flex items-center gap-2">
        <Avatar className={cn(sizeClasses[size], 'ring-2 ring-background')}>
          <AvatarImage src={employee.avatar} alt={employee.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        {showNames && (
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{employee.name}</p>
            {employee.role && (
              <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Multiple employees display
  return (
    <TooltipProvider>
      <div className="flex items-center">
        <div className="flex items-center">
          {displayedEmployees.map((employee, index) => (
            <Tooltip key={employee.id}>
              <TooltipTrigger asChild>
                <Avatar 
                  className={cn(
                    sizeClasses[size],
                    'ring-2 ring-background cursor-pointer transition-transform hover:scale-110 hover:z-10',
                    index > 0 && overlapClasses[size]
                  )}
                  style={{ zIndex: displayedEmployees.length - index }}
                >
                  <AvatarImage src={employee.avatar} alt={employee.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <p className="font-medium">{employee.name}</p>
                {employee.role && <p className="text-muted-foreground">{employee.role}</p>}
              </TooltipContent>
            </Tooltip>
          ))}
          
          {remainingCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    sizeClasses[size],
                    overlapClasses[size],
                    'rounded-full bg-muted flex items-center justify-center ring-2 ring-background cursor-pointer font-medium text-muted-foreground'
                  )}
                  style={{ zIndex: 0 }}
                >
                  +{remainingCount}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <p>{remainingCount} autre{remainingCount > 1 ? 's' : ''} assigné{remainingCount > 1 ? 's' : ''}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {showNames && employees.length <= 3 && (
          <div className="ml-2 min-w-0">
            <p className="text-sm text-muted-foreground truncate">
              {employees.map(e => e.name.split(' ')[0]).join(', ')}
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
