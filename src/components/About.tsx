import Home from "./home";

const About: React.FC = () => {
    return (
        <div>
        <Home></Home>
        <section dir="ltr" className="max-w-2xl mx-auto text-left text-lg">
<h1 className="bg-yellow-500 text-5xl">About Us</h1>  <h2 className="text-2xl font-semibold mb-3">Welcome to Personalized Nutrition Companion!</h2>
  <p>
    Your personal guide to healthy eating.<br />
    We offer tailored nutrition plans and support.
  </p>
  <h3 className="text-xl font-bold mt-6 mb-2">Your Journey</h3>
  <ul className="list-disc list-outside text-green-700 space-y-2 pl-6">
    <li>Plans designed just for you.</li>
    <li>Track your progress easily.</li>
    <li>Get timely reminders and motivation.</li>
    <li>Discover and save healthy recipes.</li>
    <li>Our virtual coach is here to help.</li>
    <li>See your success with clear charts.</li>
  </ul>
  <h3 className="text-xl font-bold mt-6 mb-2">Your Partner in Health</h3>
  <p>
    Building lasting healthy habits, together.<br />
    <br />
    <strong>Start your personalized journey today!</strong>
  </p>
</section>
</div>
    );
};

export default About;