export default function LoginForm({ onChange, formData }) {
  return (
    <>
      {/* email */}
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="email"
        >
          E-mail
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="email"
            name="email"
            autoComplete="email"
            required
            onChange={(e) => onChange(e)}
            value={formData.email}
            placeholder="Enter your email"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* password */}
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="password"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={(e) => onChange(e)}
            placeholder="Enter Password"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </>
  );
}
