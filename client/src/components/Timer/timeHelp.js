let hours, minutes, seconds;

export function getTime() {
  let nhours, nminutes, nseconds;
  nseconds = 60 - seconds;
  nminutes = 59 - minutes;
  nhours = 1 - hours;
  if (nseconds === 60) {
    nseconds = 0;
    nminutes = nminutes + 1;
  }
  if (nminutes === 60) {
    nminutes = 0;
    nhours = nhours + 1;
  }
  return (
    (nhours < 10 ? '0' + nhours : nhours) +
    ':' +
    (nminutes < 10 ? '0' + nminutes : nminutes) +
    ':' +
    (nseconds < 10 ? '0' + nseconds : nseconds)
  );
}

export function setTime({ h, m, s }) {
  seconds = s;
  minutes = m;
  hours = h;
}
