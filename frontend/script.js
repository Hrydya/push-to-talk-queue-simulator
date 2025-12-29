let socket = null;
let myName = "";

const showRegister = () => {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('register-screen').style.display = 'block';
};

const showLogin = () => {
    document.getElementById('register-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'block';
};

const Login = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Enter Username and Password');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            startApp(data);
        } else {
            alert(data.message || 'Login Failed');
        }
    } catch(networkError) {
        console.log('Error', networkError)
        alert('Unable to reach server. Please try again.');
    }
};

const Register = async () => {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    if (!username || !password) {
        alert('Enter Username and Password');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            startApp(data);
        } else {
            alert(data.message || 'Registration Failed');
        }
    } catch (error) {
        console.log('Error', error)
        alert('Server Error', error.message);

    }
};

const startApp = (data) => {
    // Set username FIRST
    myName = data.username;

    // Update UI
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('register-screen').style.display = 'none';
    document.getElementById('my-name').textContent = myName;
    document.getElementById('chat-screen').style.display = 'block';

    // Connect to socket
    socket = io('http://localhost:3000', { auth: { token: data.token } });

    // Socket events
    socket.on('connect', () => {
        socket.emit('join', myName);
    });

    socket.on('talk_granted', () => {
        document.getElementById('talk-btn').disabled = true;
        document.getElementById('end-btn').disabled = false;
        document.getElementById('talk-btn').textContent = 'You are Speaking';
    });

    socket.on('active_speaker', (name) => {
        document.getElementById('current-speaker').textContent = name || 'No one';
    });

    socket.on('queued', (data) => {
        document.getElementById('talk-btn').textContent = `Waiting #${data.position}`;
    });
};

const requestTalk = () => {
    if (socket) {
        socket.emit('request_to_talk', myName);
        document.getElementById('talk-btn').disabled = true;
    }
};

const endTalk = () => {
    if (socket) {
        socket.emit('end_talk', myName);
        document.getElementById('talk-btn').disabled = false;
        document.getElementById('end-btn').disabled = true;
        document.getElementById('talk-btn').textContent = 'Request to Talk';
    }
};

const logout = () => {
    if (socket) socket.disconnect();
    location.reload();
};