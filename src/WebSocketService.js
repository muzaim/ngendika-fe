import { createConsumer } from 'actioncable';

const WEBSOCKET_URL = 'ws://your-rails-server-url/cable';

const cable = createConsumer(WEBSOCKET_URL);

export default cable;
