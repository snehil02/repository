import React from 'react';

const Filter = ({filter}) => {
    return (
        <nav className="nav filter">
                                <button className="nav-link" onClick={filter('0')}>
                                    {/* <span className="badge badge-secondary">1</span> */}
                                    Waiting for Details
                                </button>
                                <button className="nav-link" onClick={filter('1')}>
                                    {/* <span className="badge badge-secondary">2</span> */}
                                    In Progress
                                </button>
                                <button className="nav-link" onClick={filter('2')}>
                                    {/* <span className="badge badge-secondary">3</span> */}
                                    Ongoing
                                </button>
                                <button className="nav-link active" onClick={filter('3')}>All</button>
                            </nav>
    )
}
export default Filter;