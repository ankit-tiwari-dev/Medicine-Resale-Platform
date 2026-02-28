import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";

const EmptyState = ({ message, title = "Nothing here yet", actionLink = "/browse", actionLabel = "Browse Marketplace" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-12 bg-card rounded-2xl border border-dashed border-border text-center shadow-sm">
      <h3 className="text-xl font-bold text-foreground mb-2 uppercase tracking-widest">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8 leading-relaxed font-medium">
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
