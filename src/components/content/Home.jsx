import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Home() {

    const navigate = useNavigate();

    return <div>
        <h1>Welcome to Riffrate</h1>
        <br/>
        <h2>Track artists and venues you love.</h2>
        <h2>Tell your friends whats good.</h2>
        <br/> <br/> <br/> <br/> <br/> <br/>
        <div className="d-grid gap-2 d-md-block">

            <Button type="button" style={{ backgroundColor: "#ffb0b0ff", borderColor: "#520000ff", color: "#520000ff" }}
                className="btn btn-outline-dark me-4"
                onClick={() => navigate("ReviewByBand")}
            >
                See Reviews by Band
            </Button>

            <Button type="button" style={{ backgroundColor: "#ffb0b0ff", borderColor: "#520000ff", color: "#520000ff" }}
                className="btn btn-outline-dark me-4"
                onClick={() => navigate("ReviewByVenue")}
            >
                See Reviews by Venue
            </Button>

            <Button type="button" style={{ backgroundColor: "#eff6ee", borderColor: "#273043", color: "#273043" }}
                className="btn btn-success"
                onClick={() => navigate("ReviewPage")}
            >
                Write a Review
            </Button>

        </div>
    </div>
}

