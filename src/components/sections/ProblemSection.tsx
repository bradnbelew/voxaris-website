import { motion } from "framer-motion";

const painPoints = [
  {
    main: "It can't see you're confused.",
    supporting: "You're squinting at the screen, but the AI just keeps talking."
  },
  {
    main: "It can't tell you're frustrated.",
    supporting: "You've repeated yourself three times. It doesn't notice."
  },
  {
    main: "It can't read the room.",
    supporting: "You wanted a conversation. You got a phone tree with better grammar."
  }
];

export default function ProblemSection() {
  return (
    <section className="section-padding bg-mist">
      <div className="container-wide max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-ink mb-2">
            You wanted to talk to someone.
          </h2>
          <h2 className="text-4xl font-bold text-slate">
            You got a robot reading a script.
          </h2>
        </motion.div>

        {/* Pain Points */}
        <div className="space-y-8 mb-16">
          {painPoints.map((point, index) => (
            <motion.div
              key={point.main}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-xl font-medium text-ink mb-2">
                {point.main}
              </p>
              <p className="text-base text-slate">
                {point.supporting}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Transition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-xl font-bold text-ink">
            Voxaris is different.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
