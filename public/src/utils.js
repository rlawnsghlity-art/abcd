function formatTime(date) {
    if (!date) return "--:--:--";
    const d = new Date(date);
    return d.getHours().toString().padStart(2, '0') + ":" +
           d.getMinutes().toString().padStart(2, '0') + ":" +
           d.getSeconds().toString().padStart(2, '0');
}

function getElapsedTime(startTime, now) {
    if (!startTime) return "00:00:00";
    const diff = Math.floor((now - new Date(startTime)) / 1000);
    if (diff < 0) return "00:00:00";
    const hrs = Math.floor(diff / 3600).toString().padStart(2, '0');
    const mins = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
    const secs = (diff % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

function calculateAge(dob) {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
}
