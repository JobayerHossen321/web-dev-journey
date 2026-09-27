export default function ProfileCard(props) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '300px',
      margin: '20px auto',
      textAlign: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ margin: '0 0 8px 0' }}>{props.name}</h2>
      <h4 style={{ margin: '0 0 12px 0', color: '#666' }}>{props.role}</h4>
      <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
        {props.bio}
      </p>
    </div>
  );
}