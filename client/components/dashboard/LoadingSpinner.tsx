export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary animate-spin opacity-75" 
          style={{ 
            padding: '2px',
            maskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)',
          }}
        />
        <div className="absolute inset-0 rounded-full border-4 border-border" />
      </div>
    </div>
  );
}
