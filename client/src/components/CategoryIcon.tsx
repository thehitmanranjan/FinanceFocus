import {
  Activity,
  Banknote,
  Book,
  Briefcase,
  CreditCard,
  Film,
  Gift,
  Home,
  Map,
  PlusCircle,
  ShoppingBag,
  TrendingUp,
  Utensils,
  LucideIcon,
} from "lucide-react";

interface CategoryIconProps {
  name: string;
  color: string;
  size?: number;
  className?: string;
}

type IconMap = {
  [key: string]: LucideIcon;
};

const iconMap: IconMap = {
  activity: Activity,
  banknote: Banknote,
  book: Book,
  briefcase: Briefcase,
  "credit-card": CreditCard,
  film: Film,
  gift: Gift,
  home: Home,
  map: Map,
  "plus-circle": PlusCircle,
  "shopping-bag": ShoppingBag,
  "trending-up": TrendingUp,
  utensils: Utensils,
};

export default function CategoryIcon({
  name,
  color,
  size = 20,
  className = "",
}: CategoryIconProps) {
  const IconComponent = iconMap[name] || Activity;

  return (
    <div
      className={`category-icon ${className}`}
      style={{ backgroundColor: color }}
    >
      <IconComponent size={size} className="text-white" />
    </div>
  );
}
