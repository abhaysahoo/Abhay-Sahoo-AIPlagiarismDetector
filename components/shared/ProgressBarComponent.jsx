const ProgressBarComponent = ({ percentage }) => {
    // Create a dynamic gradient based on the percentage
    const gradientStyle = {
        backgroundImage: `linear-gradient(90deg, green 0%, orange 50%, red 100%)`,
        width: '100%', // Full width for the gradient
        clipPath: `inset(0 ${100 - percentage}% 0 0)` // Only show 'percentage' of the width
    };

    return (
        <div className="max-w-md w-full">
            <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                    className="h-6 rounded-full"
                    style={gradientStyle}
                ></div>
            </div>
            <p className="text-center font-semibold mt-1">
                {percentage}% Plagiarized
            </p>
        </div>
    );
};

export default ProgressBarComponent;
