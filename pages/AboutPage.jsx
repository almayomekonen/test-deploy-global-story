import { useState } from "react";
import { FaArrowDown } from "react-icons/fa";

export default function AboutPage() {
  const [activeId, setActiveId] = useState(null);

  const teamMembers = [
    {
      id: 1,
      name: "Almayo Mekonen",
      role: "Project Lead & Educator",
      image: "/images/mekons.webp",
      description:
        "Born in Israel, passionate about coding and guiding the next generation of developers.",
      quote: "`You know why? Because of the UI`",
    },
    {
      id: 2,
      name: "Josh Milstein",
      role: "Web Developer",
      image: "/images/josh.jpg",
      description:
        "From the UK, enjoys clean code, fresh croissants, and clever JavaScript one-liners.",
      quote: "`The Triple Equals!`",
    },
    {
      id: 3,
      name: "Ilán Averbuch",
      role: "Web Developer",
      image: "/images/ilan.jpg",
      description:
        "Argentinian coder who writes React by day and sips mate by night.",
      quote: "`josh stop!`",
    },
    {
      id: 4,
      name: "Shaya Freedman",
      role: "Web Developer",
      image: "/images/shaya.jpeg",
      description:
        "UK-based developer who codes with focus and enjoys tea with biscuits on breaks.",
      quote: "`yalla yosh!`",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            The Team Behind Aardvark Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            We're a passionate group of educators and students who believe in
            the power of storytelling to connect people across cultures and
            borders.
          </p>

          <div className="flex items-center justify-center">
            <span className="flex items-center text-lg text-gray-600 max-w-3xl mx-auto mb-4 gap-2">
              Click on the image to see more information <FaArrowDown />
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="relative group"
              onMouseEnter={() => setActiveId(member.id)}
              onMouseLeave={() => setActiveId(null)}
            >
              <div className="flex flex-col items-center transition-all duration-300 transform group-hover:scale-95">
                <div
                  className={`relative w-52 h-52 rounded-full overflow-hidden mb-6 transition-all duration-500 ${
                    activeId === member.id
                      ? "shadow-lg border-4 border-blue-500"
                      : "shadow border-2 border-blue-300"
                  }`}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />

                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-0 transition-opacity duration-300 ${
                      activeId === member.id ? "opacity-70" : ""
                    }`}
                  ></div>

                  <div
                    className={`absolute bottom-0 left-0 right-0 p-4 text-white transform transition-transform duration-300 ${
                      activeId === member.id
                        ? "translate-y-0"
                        : "translate-y-full"
                    }`}
                  ></div>
                </div>

                <h3 className="text-xl font-bold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium">{member.role}</p>
                <p className="text-sm italic text-center">{member.quote}</p>
              </div>

              <div
                className={`absolute z-10 top-0 mt-24 left-1/2 transform -translate-x-1/2 w-64 bg-white rounded-lg shadow-xl p-4 transition-all duration-300 ${
                  activeId === member.id
                    ? "opacity-100 translate-y-4"
                    : "opacity-0 -translate-y-4 pointer-events-none"
                }`}
              >
                <div className="relative">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-white"></div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
