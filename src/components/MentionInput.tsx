import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface Employee {
  id: string;
  name: string;
  role: string;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  employees: Employee[];
  placeholder?: string;
  className?: string;
}

export const MentionInput = ({
  value,
  onChange,
  employees,
  placeholder = "Ajoutez un commentaire...",
  className
}: MentionInputProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Employee[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    onChange(newValue);

    // Check for @ symbol
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      // Only show suggestions if there's no space after @
      if (!textAfterAt.includes(' ')) {
        const searchTerm = textAfterAt.toLowerCase();
        const filtered = employees.filter(emp =>
          emp.name.toLowerCase().includes(searchTerm)
        );
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        setMentionStart(lastAtIndex);
        setSelectedIndex(0);
      } else {
        setShowSuggestions(false);
        setMentionStart(null);
      }
    } else {
      setShowSuggestions(false);
      setMentionStart(null);
    }
  };

  const insertMention = (employee: Employee) => {
    if (mentionStart === null) return;

    const beforeMention = value.slice(0, mentionStart);
    const cursorPos = textareaRef.current?.selectionStart || value.length;
    const afterMention = value.slice(cursorPos);

    const newValue = `${beforeMention}@${employee.name} ${afterMention}`;
    onChange(newValue);
    setShowSuggestions(false);
    setMentionStart(null);

    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = beforeMention.length + employee.name.length + 2;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (suggestions[selectedIndex]) {
          e.preventDefault();
          insertMention(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
        className={cn("resize-none", className)}
      />

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute bottom-full mb-2 left-0 w-full bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in"
        >
          <div className="py-1 max-h-[200px] overflow-y-auto">
            {suggestions.map((employee, index) => (
              <button
                key={employee.id}
                onClick={() => insertMention(employee)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-left transition-colors",
                  index === selectedIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{employee.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
