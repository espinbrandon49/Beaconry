import { ENV } from "./config/env";

export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Beaconry</h1>
      <p>API Base URL: {ENV.API_BASE_URL}</p>
    </div>
  );
}
