/**
 * A visualization plugin that displays courses in a table
 * that can be sorted and filtered.
 */

import React from 'react'
import { ReactTabulator } from 'react-tabulator'
import './tabulator.css'
import { Course, VisPlugin } from '../Analysis'

interface CourseRow extends Course {
    rowNum: number,
}

interface VisualizerState {
    allCourses: CourseRow[],
    displayedCourses: CourseRow[],

    rowsPerPageTemp: number,

    rowsPerPage: number,
    rowsStart: number,
    sortBy: string,

    name: string,
    category: string,
    instructor: string,
    level: string,
    organization: string,
    year: string,
    size: string,
}

const courseColumns = [
    { title: "Row #", field: "rowNum" },
    { title: "Course Name", field: "name" },
    { title: "Description", field: "description", },
    { title: "Instructors", field: "instructorNames", },
    { title: "Organization", field: "organizationName", },
    { title: "Category", field: "category", },
    { title: "Level", field: "level", },
    { title: "Total Students", field: "totalStudents", },
    { title: "Total Hours", field: "totalHours", },
    { title: "Total Weeks", field: "totalWeeks", },
    { title: "Estimated Workload", field: "estimatedWorkload", },
    { title: "Rate", field: "rate", },
    { title: "Price", field: "price", },
]

class Visualizer extends React.Component<{}, VisualizerState> {
    private initialized: boolean = false

    constructor (props: {}) {
        super(props)
        this.state = {
            allCourses: [],
            displayedCourses: [],
            sortBy: "name",
            rowsPerPageTemp: 10,
            rowsPerPage: 10,
            rowsStart: 0,


            name: '',
            category: '',
            level: '',
            instructor: '',
            organization: '',
            year: '',
            size: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount (): void {
        if (!this.initialized) {
            this.initialized = true
            this.getCourses()
        }
    }
    getCourses = async (): Promise<void> => {
        const response = await fetch(this.buildURL());
        const json = await response.json();

        let courses = json.courses.slice();
        courses.sort((c1: any, c2: any) => {
            if (c1[this.state.sortBy] < c2[this.state.sortBy]) {
                return -1;
            }
            if (c1[this.state.sortBy] > c2[this.state.sortBy]) {
                return 1;
            }
            return 0;
        })
        courses.map((course: any, idx: number): CourseRow => {
            course.rowNum = idx + 1;
            return course;
        })

        this.setState((prevState) => {
            return {
                allCourses: courses,
                displayedCourses: courses.slice(0, prevState.rowsPerPageTemp),
                rowsStart: 0,
                rowsPerPage: prevState.rowsPerPageTemp,
            }
        })
    }

    buildURL (): string {
        let url: string = '/courses?'
        if (this.state.name.length !== 0) {
            url += `name=${this.state.name}&`
        }
        if (this.state.category.length !== 0) {
            url += `category=${this.state.category}&`
        }
        if (this.state.level.length !== 0) {
            url += `level=${this.state.level}&`
        }
        if (this.state.instructor.length !== 0) {
            url += `instructor=${this.state.instructor}&`
        }
        if (this.state.organization.length !== 0) {
            url += `organization=${this.state.organization}&`
        }
        if (this.state.year.length !== 0) {
            url += `year=${this.state.year}&`
        }
        if (this.state.size.length !== 0) {
            url += `size=${this.state.size}&`
        }
        return url
    }


    handleSubmit (evt: any): void {
        evt.preventDefault();
        this.getCourses()
    }
    handleChange (evt: any): void {
        const value = evt.target.value
        this.setState({
            ...this.state,
            [evt.target.name]: value
        })
    }
    sortByChangeHandler = (evt: any): void => {
        this.setState({
            sortBy: evt.target.value
        })
    }
    rowsPerPageChangeHandler = (evt : any): void => {
        this.setState({
            rowsPerPageTemp: parseInt(evt.target.value)
        })
    }
    prevPage = (evt : any) : void => {
        if (this.state.rowsStart === 0) return;
        else this.setState((prevState) => {
            return {
                rowsStart: prevState.rowsStart - prevState.rowsPerPage,
                displayedCourses: prevState.allCourses.slice(prevState.rowsStart - prevState.rowsPerPage, prevState.rowsStart)
            }
        })
    }
    nextPage = (evt : any): void => {
        console.log(this.state)
        if (this.state.rowsStart + this.state.rowsPerPage >= this.state.allCourses.length) return;
        else this.setState((prevState) => {
            return {
                rowsStart: prevState.rowsStart + prevState.rowsPerPage,
                displayedCourses: prevState.allCourses.slice(prevState.rowsStart + prevState.rowsPerPage, prevState.rowsStart + 2 * prevState.rowsPerPage)
            }
        })
    }

    // the scrolling is a problem with react-tabulator, not react
    // maybe have like allCourses and tableCourses? in case it's computing the .slice() on each render
    render (): JSX.Element {
        return (
        <div>
            {/* TODO add page indicators, page goto */}
            <p>Page {Math.round(this.state.rowsStart / this.state.rowsPerPage) + 1} of {Math.ceil(this.state.allCourses.length / this.state.rowsPerPage)}</p>
            <p>
                <button onClick={this.prevPage}>Previous Page</button>
                <button onClick={this.nextPage}>Next Page</button>
            </p>
            <ReactTabulator
                data={this.state.displayedCourses}
                columns={courseColumns}
                layout={"fitDataStretch"}
            />
            <form className='settings'>
                <h2>Appearance Options:</h2>
                <p>
                    <label htmlFor='rowsPerPage'>Rows Per Page:</label>
                    <input type='number' id='rowsPerPage' name='rowsPerPage' onChange={this.rowsPerPageChangeHandler} value={this.state.rowsPerPageTemp} />
                </p>
                <p>
                    <label htmlFor='sortBy'>Sort By:</label>
                    <select name='sortBy' onChange={this.sortByChangeHandler}>
                        {courseColumns.slice(1).map((col) => (
                            <option value={col.field}>{col.title}</option>
                        ))}
                    </select>
                </p>
                {/* Filter widget below adapted from sample plugins */}
                <h2>Filter Options:</h2>
                <p>
                    <label>Course Name: </label>
                    <input type='text' name='name' value={this.state.name} onChange={this.handleChange} />
                </p>
                <p>
                    <label>Category: </label>
                    <input type='text' name='category' value={this.state.category} onChange={this.handleChange} />
                </p>
                <p>
                    <label>Level: </label>
                    <input type='text' name='level' value={this.state.level} onChange={this.handleChange} />
                </p>
                <p>
                    <label>Instructor Name: </label>
                    <input type='text' name='instructor' value={this.state.instructor} onChange={this.handleChange} />
                </p>
                <p>
                    <label>Organization Name: </label>
                    <input type='text' name='organization' value={this.state.organization} onChange={this.handleChange} />
                </p>
                <p>
                    <label>Year: </label>
                    <input type='text' name='year' value={this.state.year} onChange={this.handleChange} />
                </p>
                <p>
                    <label>Limit: </label>
                    <input type='text' name='size' value={this.state.size} onChange={this.handleChange} />
                </p>

                <input type='submit' value='Apply Settings' onClick={this.handleSubmit} />
            </form>
        </div>
        )
    }
}

// define and export the "plugin" object, which implements the "VisPlugin" interface
export const plugin: VisPlugin = {
    name: 'Table visualization plugin',
    renderer: () => <Visualizer />
}
