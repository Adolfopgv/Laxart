import React from 'react'

export default function StarRating({ rating }) {
    const starsRating = () => {
        switch (rating) {
            case 0: return (
                <div className="rating">
                    <input type="radio" name="rating-1" className="rating-hidden" checked disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                </div>
            );
            case 1: return (
                <div className="rating">
                    <input type="radio" name="rating-1" className="mask mask-star" checked disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                </div>
            );
            case 2: return (
                <div className="rating">
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" checked disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                </div>
            );
            case 3: return (
                <div className="rating">
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" checked disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                </div>
            );
            case 4: return (
                <div className="rating">
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" checked disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                </div>
            );
            case 5: return (
                <div className="rating">
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" disabled />
                    <input type="radio" name="rating-1" className="mask mask-star" checked disabled />
                </div>
            );
            default: return null;
        }
    }

    return (
        <>
            {starsRating()}
        </>
    )
}
