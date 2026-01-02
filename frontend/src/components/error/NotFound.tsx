function NotFound() {
  return (
    <div style={containerStyles}>
      <h1>404 - Page Not Found</h1>
      <p>Go enumerate my ass ;)</p>
    </div>
  );
}

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '90vh',
  textAlign: 'center',
};

export default NotFound;
