import React, { useEffect, useState } from 'react';
import { combineLatest, interval, merge } from 'rxjs';
import { auditTime, switchMap, map, take } from 'rxjs/operators';

let temprature;
let humidity;
let airPressure;

export function instantiateObservables(time1, time2, time3) {
  temprature = interval(time1).pipe(map(() => Math.random() * 1000));
  humidity = interval(time2).pipe(map(() => Math.random() * 1000));
  airPressure = interval(time3).pipe(map(() => Math.random() * 1000));
  return { temprature, humidity, airPressure };
}
instantiateObservables(1200, 2000, 4000);

export const discardIfStale = (
  inputObservable,
  duration = 1000,
  defaultValue = 'N/A'
) => {
  return merge(
    inputObservable.pipe(
      switchMap(() =>
        interval(duration).pipe(
          map(() => defaultValue),
          take(1)
        )
      )
    ),
    inputObservable
  );
};

export default function Dashboard() {
  const [displayObject, setDisplayObject] = useState({
    temprature: 'Computing...',
    humidity: 'Computing...',
    air: 'Computing...',
  });
  useEffect(() => {
    const updatedTemprature = discardIfStale(temprature);
    const updatedHumidity = discardIfStale(humidity);
    const updatedAirPressure = discardIfStale(airPressure);

    combineLatest(updatedTemprature, updatedHumidity, updatedAirPressure)
      .pipe(
        auditTime(100),
        map((values) => ({
          temprature: values[0],
          humidity: values[1],
          air: values[2],
        }))
      )
      .subscribe((displayObject) => setDisplayObject({ ...displayObject }));
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div>temperature -> {displayObject.temprature}</div>
      <div>humidity -> {displayObject.humidity}</div>
      <div>air pressure -> {displayObject.air}</div>
    </div>
  );
}
