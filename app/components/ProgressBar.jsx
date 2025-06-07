const ProgressBar = () => {
  const steps = [
    "Postcode",
    "Waste Type",
    "Select Skip",
    "Permit Check",
    "Choose Date",
    "Payment",
  ];
  const currentStep = 2;

  return (
    <nav className="overflow-x-auto w-full mb-10">
      <ul className="flex min-w-max gap-4 px-2 sm:px-4 md:px-6 text-sm sm:text-base font-medium">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;

          return (
            <li
              key={idx}
              className={`flex items-center whitespace-nowrap space-x-2 ${
                isActive
                  ? "text-white font-semibold"
                  : isCompleted
                  ? "text-[#00BFA6]"
                  : "text-gray-500"
              }`}
            >
              <span
                className={`w-3 h-3 shrink-0 rounded-full ${
                  isActive
                    ? "bg-[#0037C1]"
                    : isCompleted
                    ? "bg-[#00BFA6]"
                    : "bg-gray-400"
                }`}
              />
              <span className="truncate">{step}</span>
              {idx < steps.length - 1 && (
                <span className="text-gray-400">›</span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default ProgressBar;
