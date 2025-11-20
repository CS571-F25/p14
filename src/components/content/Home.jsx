import { Button } from "react-bootstrap";
import { Link } from 'react-router';
/* TODO
- display nav bar
- display 10? (i think it should be 25) most recent reviews
*/

export default function Home (props) {
    return <div>
        <h1>Welcome to Riffrate</h1>
        <br/>
        <h3>Track artists and venues you love.</h3>
        <h3>Tell your friends whats good.</h3>
        <br/>
        <div className="d-grid gap-2 d-md-block">
            <Link to="/ReviewByBand">
                <button type="button" className="btn btn-outline-dark me-4">See Reviews by Band</button>
            </Link>
            <Link to="/ReviewByVenue">
                <button type="button" className="btn btn-outline-dark me-4">See Reviews by Venue</button>
            </Link>
        </div>
    </div>
}