import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
      <Input
        placeholder={placeholder}
        className="pl-10 border-slate-300 focus-visible:ring-indigo-500"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export const StatusFilter = ({ options, value, onChange, className = "" }) => {
  return (
    <Select value={value} onValueChange={onChange} className={className}>
      <SelectTrigger className="w-[140px] border-slate-300">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const FilterBar = ({ children, className = "" }) => {
  return (
    <div
      className={`flex flex-wrap justify-start md:justify-end gap-2 ${className}`}
    >
      {children}
    </div>
  );
};

export const FilterButton = ({ onClick, className = "" }) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={`border-slate-300 ${className}`}
    >
      <SlidersHorizontal className="h-4 w-4 mr-2" />
      More Filters
    </Button>
  );
};

export const ExportButton = ({ onClick, className = "" }) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={`border-slate-300 ${className}`}
    >
      <Download className="h-4 w-4 mr-2" />
      Export
    </Button>
  );
};
