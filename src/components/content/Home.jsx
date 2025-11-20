import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Home() {

    const navigate = useNavigate();

    return <div>
        <h1>Welcome to Riffrate</h1>
        <br/>
        <h3>Track artists and venues you love.</h3>
        <h3>Tell your friends whats good.</h3>
        <br/>

        <div className="d-grid gap-2 d-md-block">

            <Button style={{ backgroundColor: "#ff2f00ff", borderColor: "#273043", color: "#FFF" }}
                className="btn btn-outline-dark me-4"
                onClick={() => navigate("/ReviewByBand")}
            >
                See Reviews by Band
            </Button>

            <Button style={{ backgroundColor: "#ff2f00ff", borderColor: "#273043", color: "#FFF" }}
                className="btn btn-outline-dark me-4"
                onClick={() => navigate("/ReviewByVenue")}
            >
                See Reviews by Venue
            </Button>

            <Button style={{ backgroundColor: "#273043", borderColor: "#FF5733", color: "#FFF" }}
                className="btn btn-success"
                onClick={() => navigate("/ReviewPage")}
            >
                Write a Review
            </Button>

        </div>
    </div>
}

