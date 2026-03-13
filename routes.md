# Application Routes

## AUTH

| Route | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/login` | GET, POST | Public | User sign-in and authentication |
| `/register` | GET, POST | Public | New citizen account registration |
| `/forgot-password` | GET, POST | Public | Password recovery request |
| `/reset-password` | GET, PUT | Public | execute password reset |

## DASHBOARD

| Route | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/admin/dashboard` | GET | Admin | Regional monitoring and authority metrics |
| `/citizen/dashboard` | GET | Citizen | Personal environmental health summary |

## MAP

| Route | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/citizen/map` | GET | Citizen | Public pollution heatmap and sensor view |
| `/admin/map` | GET | Admin | Advanced administrative map interface |
| `/map/focus/:type` | GET | Shared | Filter map by specific pollution type |
| `/map/location/:lat/:lng` | GET | Shared | Center map on specific coordinates |
| `/map/sensor/:id` | GET | Shared | View detailed telemetry for specific station |

## COMPLAINTS

| Route | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/citizen/file-complaint` | GET, POST | Citizen | Submit a new pollution report |
| `/citizen/my-complaints` | GET | Citizen | Track history of filed reports |
| `/citizen/complaint/:id` | GET | Citizen | View detailed resolution of a report |
| `/admin/complaints` | GET | Admin | Manage and review incoming civic reports |

## ALERTS

| Route | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/admin/alerts` | GET | Admin | Manage critical environmental risk alerts |
| `/citizen/alerts` | GET | Citizen | View local safety and pollution warnings |

## INVESTIGATION

| Route | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/admin/investigation/:id` | GET, PUT | Admin | Manage active legal and site investigations |
| `/admin/investigation/:id/timeline` | GET | Admin | View chronological audit log of investigation |

## COMPLIANCE

| Route | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/admin/compliance` | GET | Admin | Monitor industrial regulatory adherence |
| `/admin/compliance/industry/:name` | GET | Admin | View specific industry sector compliance status |

## PROFILE

| Route | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/citizen/profile` | GET | Citizen | View impact score and reporting history |
| `/admin/profile` | GET | Admin | View official credentials and jurisdiction |
| `/profile/edit` | GET, PUT | Shared | Update account information and settings |

## AWARENESS

| Route | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/citizen/awareness` | GET | Citizen | Educational hub for environmental health |
| `/citizen/awareness/:topic` | GET | Citizen | Detailed guides on specific pollutants |

## AI

| Route | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/admin/ai` | GET, POST | Admin | Enterprise AI for geospatial analysis |
| `/citizen/ai-assistant` | GET, POST | Citizen | Interactive AI for environmental help |

## NOTIFICATIONS

| Route | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/citizen/notifications` | GET | Citizen | Personal alerts and report status updates |
| `/admin/notifications` | GET | Admin | System alerts and authority task updates |

## SETTINGS

| Route | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/citizen/settings` | GET, PUT | Citizen | Manage privacy and portal preferences |
| `/admin/settings` | GET, PUT | Admin | Manage administrative tools and preferences |

## ANALYTICS

| Route | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/admin/analytics` | GET | Admin | Advanced pollution trend and metric analysis |

## TRACKING

| Route | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/track/:complaintId` | GET | Public | Public tracking of specific report progress |

## SYSTEM

| Route | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/404` | GET | Public | Navigation error fallback page |
| `/maintenance` | GET | Public | System downtime information page |
| `/offline` | GET | Public | Connectivity status fallback view |
