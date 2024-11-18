export default interface IPositionInWaitlist {
    /**
     * The current position in the waitlist.
     */
    position: number;

    /**
     * Indicate if the checkin is available. If the position is 0 and
     * checkInAllowed is false, it means the restaurant is currently at
     * capacity but the party is the next one.
     */
    checkInAllowed: boolean;
}
