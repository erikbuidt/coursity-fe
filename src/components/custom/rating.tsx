function Rating({
  rating,
}: {
  rating: number
  activeClassName?: string
  nonActiveClassName?: string
}) {
  const handleWidth = (order: number) => {
    if (order <= rating) return '100%'
    if (order > rating && order - rating < 1) return (rating - Math.floor(rating)) * 100 + '%'
    return '0%'
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <div
              style={{
                width: handleWidth(index + 1),
                position: 'absolute',
                top: 0,
                left: 0,
                overflow: 'hidden',
              }}
            >
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
              <svg
                enableBackground="new 0 0 15 15"
                viewBox="0 0 15 15"
                x="0"
                y="0"
                style={{ width: '18px', height: '18px', fill: 'currentcolor', color: '#ffba57' }}
              >
                <polygon
                  points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                ></polygon>
              </svg>
            </div>
            <svg
              enableBackground="new 0 0 15 15"
              viewBox="0 0 15 15"
              x="0"
              y="0"
              style={{ width: '18px', height: '18px', fill: 'currentcolor', color: '#ccc' }}
            >
              <polygon
                points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
              ></polygon>
            </svg>
          </div>
        ))}
    </div>
  )
}

export default Rating
