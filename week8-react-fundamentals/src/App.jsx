import ProfileCard from './ProfileCard';

function App() {
  return (
    <main style={{ padding: '20px' }}>
      <ProfileCard 
        name="Jobayer Hossen" 
        role="Full Stack Developer" 
        bio="Building responsive web applications with React, Node.js, and modern web tech." 
      />
      <ProfileCard 
        name="Sarah Jenkins" 
        role="UI/UX Designer" 
        bio="Crafting clean, accessible user experiences and interactive modern interfaces." 
      />
    </main>
  );
}

export default App;