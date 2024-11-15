

type DistanceProps = {
    leg: google.maps.DirectionsLeg
}

export default function Distance({ leg }: DistanceProps) {   
    return (
        <>
            {leg.distance.text} ({leg.duration.text})
        </>
    )
}