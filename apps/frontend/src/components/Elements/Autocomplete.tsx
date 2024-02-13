import { Button, Label, List, TextInput } from "flowbite-react";

type AutocompleteProps<T> = {
  suggestions: T[];
  setSuggestions: React.Dispatch<React.SetStateAction<T[]>>;
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  id?: string;
  htmlFor?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  rightIcon?: React.FC<React.SVGProps<SVGSVGElement>> | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
};

const Autocomplete = <T,>({
  suggestions,
  setSuggestions,
  value,
  setValue,
  id,
  htmlFor,
  label,
  placeholder,
  required,
  rightIcon,
  onChange,
  onFocus,
  onBlur,
}: AutocompleteProps<T>) => {
  return (
    <div className="relative space-y-2">
      <Label id={id} htmlFor={htmlFor} value={label} />
      <TextInput
        id={id}
        autoComplete="off"
        type="text"
        placeholder={placeholder}
        required={required}
        rightIcon={rightIcon}
        value={value as string | number | readonly string[] | undefined}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {suggestions.length > 0 && (
        <List
          unstyled
          className="absolute bg-gray-50 dark:bg-gray-800 w-full border z-10 rounded-md shadow-lg overflow-hidden p-2 space-y-2"
        >
          {suggestions.map((suggestion) => (
            <List.Item key={suggestion as React.Key | null | undefined}>
              <Button
                size="sm"
                outline
                className="w-full"
                type="button"
                onClick={() => {
                  setValue(suggestion);
                  setSuggestions([]);
                }}
              >
                {String(suggestion)}
              </Button>
            </List.Item>
          ))}
        </List>
      )}
    </div>
  );
};

export { Autocomplete };
