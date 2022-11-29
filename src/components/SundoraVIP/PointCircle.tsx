import React, { useEffect, useState } from 'react';

function PointCircle({ pointData }: { pointData: any }): JSX.Element {
  const [circleProgressBar, setCircleProgressBar] = useState<any>({
    left: 0,
    right: 0,
  });

  const setDataInit = () => {
    const points = pointData.all_points;
    const maxPercent = 100;
    const maxPoints =
      pointData?.all_points +
      (pointData?.tier?.next_tier ? pointData?.tier?.next_tier?.needed_points : 0);

    const transformLeft = 180;
    const transformRight = transformLeft * (maxPercent / 100);

    const dataCircleProgress = {
      left: 0,
      right: 0,
    };
    if (points > 0) {
      if (points >= maxPoints) {
        dataCircleProgress.left = transformLeft;
        dataCircleProgress.right = transformRight;
      } else if (points <= maxPoints / 2) {
        const transform = (points / maxPoints) * 2 * transformLeft;
        dataCircleProgress.left = transform;
        dataCircleProgress.right = 0;
      } else if (points >= maxPoints / 2) {
        const transform = (points / maxPoints - 15 / 100) * transformRight;
        dataCircleProgress.left = transformLeft;
        dataCircleProgress.right = transform;
      }
    }
    setCircleProgressBar({ ...dataCircleProgress });
  };

  useEffect(() => {
    setDataInit();
  }, []);

  return (
    <div className="circular">
      <div className="inner"></div>
      <div className="text-circle">
        <p className="title">{pointData?.points ?? 0}</p>
        <p className="sub">points</p>
      </div>
      <div className="circle">
        <div className="bar left">
          <div
            className="progress"
            style={{ transform: `rotate(${circleProgressBar.left}deg)` }}
          ></div>
        </div>
        <div className="bar right">
          <div
            className="progress"
            style={{ transform: `rotate(${circleProgressBar.right}deg)` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default PointCircle;
