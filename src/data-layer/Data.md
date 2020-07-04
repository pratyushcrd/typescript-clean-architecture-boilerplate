## Data Layer

Data layer represents a set of components that are responsible for talking to the data source. The data sources can be any of database, cache, search engine, external sources.
Data layer is divided into two parts: driver and respositories.

# driver
driver contain Driver components that establish connection to the data source. Driver components implements LifeCycle interface which means they have a start/stop functionality to establish/disconnect connection, they also have a .get() method to return the instance of datasource connected.
.get() method must always returns a resolved value and not a promise. (As connection must be established in .start() method which returns a promise)
Data driver must always be registered as Sigleton when only one connection to the source is required.

# repositories
repositories are components that implement the entity-interfaces. respositories can use multiple data sources to get the desired results.