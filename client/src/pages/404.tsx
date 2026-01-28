import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-800 relative flex items-center justify-center p-8">
      {/* Background Image with Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url(/narrabri-bg.jpg)" }}
      ></div>

      {/* Content (needs to be above background) */}
      <div className="relative z-10 text-center space-y-8 max-w-2xl">
        {/* Big 404 Number */}
        <div className="relative">
          <h1 className="text-[180px] font-black text-transparent bg-clip-text bg-gray-200/50 leading-none select-none">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-400">
            Looks like this page took a wrong turn and got lost in the internet.
          </p>
        </div>

        {/* Back Home Button */}
        <Button variant="default" size="lg">
          <a href="/">Go Back</a>
        </Button>
      </div>
    </div>
  );
}
