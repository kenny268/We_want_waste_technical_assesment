const ProgressBar = () => {
  const steps = [
    "Postcode",
    "Waste Type",
    "Select Skip",
    "Permit Check",
    "Choose Date",
    "Payment",
  ];
  const currentStep = 2; // index of "Select Skip"

  return (
    <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 mb-10 text-sm sm:text-base font-medium">
      {steps.map((step, idx) => {
        const isActive = idx === currentStep;
        const isCompleted = idx < currentStep;

        return (
          <div
            key={idx}
            className={`flex items-center space-x-2 ${
              isActive
                ? "text-white font-semibold"
                : isCompleted
                ? "text-[#00BFA6]"
                : "text-gray-500"
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full ${
                isActive
                  ? "bg-[#0037C1]"
                  : isCompleted
                  ? "bg-[#00BFA6]"
                  : "bg-gray-500"
              }`}
            />
            <span>{step}</span>
            {idx < steps.length - 1 && (
              <span className="hidden sm:inline text-gray-600">›</span>
            )}
          </div>
        );
      })}
    </nav>
  );
};
export default ProgressBar;