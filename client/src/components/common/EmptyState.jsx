import { ShoppingCart } from "lucide-react";
import Button from "./Button";
import { Link } from "react-router-dom";

const EmptyState = ({ message, title = "Nothing here yet", actionLink = "/browse", actionLabel = "Browse Marketplace" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl border border-dashed border-border text-center shadow-sm">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
        <ShoppingCart className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8 leading-relaxed">
        {message}
      </p>
      {actionLink && (
        <Link to={actionLink}>
          <Button variant="outline" size="sm" className="font-bold">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
