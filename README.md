# ThunderStats

## Overview

ThunderStats is a React-based data visualization web app built using the unofficial War Thunder API. The project focuses on clearly presenting information about aircraft, stats, and comparisons in a tactical, military-style design that's both engaging and easy to use.

## My Approach

### Development Steps:
- Initially set up and experimented with the API in separate test projects to learn how to fetch images and data effectively.
- Reviewed other War Thunder API-based projects to explore possibilities and improve planning.
- Created simple, clean wireframes to guide the project's structure and user interface.
- Reused and refined code from earlier experiments, integrating it into the main application.
- Worked on improving data accuracy from the API, which proved to be a challenge.
- Used ChatGPT to explore animated backgrounds and visual design ideas.
- Iteratively refined layouts and styling to closely match the original wireframes.

### Final Development Notes:
- Finalized styling for all pages.
- Added and completed a timeline page.
- Fixed display issues with the radar graph on the comparison page.
- Ensured aircraft BR updates properly when the Ground Battle toggle is enabled.
- Implemented reliable filtering logic for all nations and vehicle types.
- Improved the search function to be more lenient and user-friendly.
- Timeline chart works, though the API provides limited patch/version data — changes are visible on select vehicles.
- Landing page graph is custom-built as required by the project brief.
- Responsive layout was attempted, with mixed results.
- All pages are connected and accessible via the navigation bar.
- Color scheme was adjusted to enhance clarity and visual balance.
- ChatGPT was used to understand timeline data, especially due to weak schema documentation in the official source.
- A timeline schema file from the API's GitHub was used to better understand how to implement version tracking.
- A `Global.css` stylesheet was created with ChatGPT’s help to ensure clean, consistent styling across components.
- Pagination was implemented for API calls to retrieve all vehicles (beyond the default 200 limit) and improve performance.


## Key Features

- Fetches real-time vehicle data using the unofficial War Thunder API.
- Filters and displays essential information for easier comparison and readability.
- Comparison page allows direct evaluation of two vehicles by speed, cost, and mass.
- Radar charts provide a visual comparison of mass, repair cost, crew size, and research points.
- Timeline page displays vehicle progression across game updates, including:
  - Battle Rating (BR) changes
  - Repair cost adjustments
  - Rank updates over time
- Military-inspired user interface with a clean, tactical design.
- Includes animated backgrounds for atmosphere without affecting usability.
- Basic responsive layout implemented for various screen sizes.
- Improved filter logic supports multiple vehicle types, subtypes, and nations.
- API pagination implemented to support full dataset loading beyond the default 200-vehicle limit.

## Future Plans

- Redesign the layout to offer more flexible and user-friendly filtering options.
- Expand the comparison page to allow more than two vehicles to be compared simultaneously.
- Add a modification overview section for each vehicle, displaying all unlockable modules and upgrades.
- Improve responsiveness across devices with a fully adaptive layout and component structure.
- Integrate additional stats and sorting controls to give users more control over how data is viewed.
- Include unit role tags (e.g., interceptor, support, tank destroyer) for better classification and filtering.
- Explore the possibility of saving and exporting comparison results.
- Consider adding localization support for multiple languages in the interface.

## Key Notes

- The API used is unofficial and has strict data access rules. As a result, some vehicles may not appear, including hidden or event-exclusive units.
- The timeline feature is limited by the scope of available patch data. Only certain vehicles show historical changes in battle rating, rank, or repair cost.
- Some modification and unlockable data is not currently available or exposed by the API.




## Installation and Setup

### Clone the repository:
```sh
git clone <https://github.com/DavidGolding200238/David-Golding-200238-DV200S1F1-ThunderStats.git>
```

### Move into the project folder:
```sh
cd David-Golding-200238-DV200S1F1-ThunderStats

```

### Install dependencies:
```sh
npm install
```

### Start the app:
```sh
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

## Dependencies
- React
- Axios (API fetching)
- Chart.js (data visualization)
- Additional dependencies listed in `package.json`

## Screenshots

![Landing Page](<Screenshots/Landing Page.png>)

![Speed Chart](<Screenshots/Speed Chart.png>)

![Mass Chart](<Screenshots/Mass Chart.png>)

![Cost Chart](<Screenshots/Cost chart.png>)

![Radar Chart](<Screenshots/Radar Chart.png>)

![Time Line Battle Rating](<Screenshots/Timeline BR.png>)

![Time Line repair costs](<Screenshots/Timeline repair costs.png>)

![Time Line Rank Change](<Screenshots/Timeline rank change.png>)

## Author
**200238_David Golding**  