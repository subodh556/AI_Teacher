'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { fetchSupportedLanguages, PistonRuntime, getCommonLanguages } from '@/lib/code-execution';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function LanguageSelector({ value, onChange, className }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [languages, setLanguages] = useState<PistonRuntime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the display name for the current language
  const getLanguageDisplayName = (languageId: string) => {
    const language = languages.find(
      lang => lang.language === languageId || lang.aliases.includes(languageId)
    );
    
    if (language) {
      return `${language.language} (${language.version})`;
    }
    
    // Fallback to common languages
    const commonLanguage = getCommonLanguages().find(
      lang => lang.id === languageId
    );
    
    if (commonLanguage) {
      return `${commonLanguage.name} (${commonLanguage.version})`;
    }
    
    return languageId;
  };
  
  // Fetch supported languages on component mount
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setLoading(true);
        const supportedLanguages = await fetchSupportedLanguages();
        setLanguages(supportedLanguages);
        setError(null);
      } catch (err) {
        console.error('Failed to load languages:', err);
        setError('Failed to load languages. Using common languages instead.');
        // Use common languages as fallback
        const commonLanguages = getCommonLanguages().map(lang => ({
          language: lang.id,
          version: lang.version,
          aliases: []
        }));
        setLanguages(commonLanguages);
      } finally {
        setLoading(false);
      }
    };
    
    loadLanguages();
  }, []);
  
  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            {loading 
              ? 'Loading languages...' 
              : value 
                ? getLanguageDisplayName(value)
                : 'Select language...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search language..." />
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {languages.map((language) => (
                <CommandItem
                  key={`${language.language}-${language.version}`}
                  value={language.language}
                  onSelect={() => {
                    onChange(language.language);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === language.language ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {language.language} ({language.version})
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
