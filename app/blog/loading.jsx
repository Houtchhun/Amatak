// Prevent Header error by returning a minimal loading UI with searchQuery props if Header is used in BlogPage loading
export default function Loading() {
  // If your BlogPage uses <Header searchQuery={...} setSearchQuery={...} />, you should provide those props here as well.
  // Example:
  // return <Header searchQuery="" setSearchQuery={() => {}} />

  // Otherwise, a simple loading indicator:
  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-gray-500 text-lg">Loading...</span>
    </div>
  )
}
