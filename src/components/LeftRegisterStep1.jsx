export default function LeftRegisterStep1({ formData, setFormData, onNext, isLoading }) {
    return (
        <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-semibold text-[#009e92]">Basic Information</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Step 1 of 3</p>

            <input
                placeholder="Full Name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#009e92] text-sm sm:text-base"
            />

            <input
                placeholder="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#009e92] text-sm sm:text-base"
            />

            <input
                placeholder="Phone Number"
                type="tel"
                maxLength={10}
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/[^0-9]/g, '') })}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#009e92] text-sm sm:text-base"
            />

            <button
                className="w-full bg-[#009e92] text-white mt-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base cursor-pointer hover:bg-[#018177] transition-colors"
                onClick={onNext}
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Next'}
            </button>
        </div>
    );
}
