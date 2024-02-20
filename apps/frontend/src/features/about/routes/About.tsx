import { Table as FlowbiteTable } from "flowbite-react";

const About = () => {
  return (
    <div className="text-center p-16 flex flex-col items-center h-screen container">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        WPI Computer Science Department, CS3733-C24 Software Engineering
      </h1>
      <h1 className="py-1 text-md italic font-semibold text-gray-500 dark:text-gray-400">
        Prof. Wilson Wong, Coach: Ari Schechter
      </h1>
      <div className="py-12 mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="overflow-x-auto ">
            <FlowbiteTable className="dark:bg-gray-800 text-gray-900 dark:text-white">
              <FlowbiteTable.Head>
                <FlowbiteTable.HeadCell key={"Name"}>
                  Name
                </FlowbiteTable.HeadCell>
                <FlowbiteTable.HeadCell key={"Position"}>
                  Position
                </FlowbiteTable.HeadCell>
              </FlowbiteTable.Head>
              <FlowbiteTable.Body className="divide-y text-md">
                <FlowbiteTable.Row>
                  <FlowbiteTable.Cell>Reda Boutayeb</FlowbiteTable.Cell>
                  <FlowbiteTable.Cell>
                    Assistant Lead Software + Algorithms
                  </FlowbiteTable.Cell>
                </FlowbiteTable.Row>
                <FlowbiteTable.Row>
                  <FlowbiteTable.Cell>Abraham Dionne</FlowbiteTable.Cell>
                  <FlowbiteTable.Cell>
                    Scrum Master + Front End
                  </FlowbiteTable.Cell>
                </FlowbiteTable.Row>
                <FlowbiteTable.Row>
                  <FlowbiteTable.Cell>Daniel Feng</FlowbiteTable.Cell>
                  <FlowbiteTable.Cell>
                    Project Manager + Front End
                  </FlowbiteTable.Cell>
                </FlowbiteTable.Row>
                <FlowbiteTable.Row>
                  <FlowbiteTable.Cell>Oliver Gates</FlowbiteTable.Cell>
                  <FlowbiteTable.Cell>Front End</FlowbiteTable.Cell>
                </FlowbiteTable.Row>
                <FlowbiteTable.Row>
                  <FlowbiteTable.Cell>Philip Heney</FlowbiteTable.Cell>
                  <FlowbiteTable.Cell>
                    Documentation Analyst + Front End
                  </FlowbiteTable.Cell>
                </FlowbiteTable.Row>
                <FlowbiteTable.Row>
                  <FlowbiteTable.Cell>Hien Hoang</FlowbiteTable.Cell>
                  <FlowbiteTable.Cell>Database + Algorithms</FlowbiteTable.Cell>
                </FlowbiteTable.Row>
                <FlowbiteTable.Row>
                  <FlowbiteTable.Cell>Miya Judy</FlowbiteTable.Cell>
                  <FlowbiteTable.Cell>
                    Product Owner + Front End
                  </FlowbiteTable.Cell>
                </FlowbiteTable.Row>
                <FlowbiteTable.Row>
                  <FlowbiteTable.Cell>Lucas Lamenha</FlowbiteTable.Cell>
                  <FlowbiteTable.Cell>
                    Assistant Lead Software Engineer + Databases
                  </FlowbiteTable.Cell>
                </FlowbiteTable.Row>
                <FlowbiteTable.Row>
                  <FlowbiteTable.Cell>
                    Giovanni Larson Vasquez
                  </FlowbiteTable.Cell>
                  <FlowbiteTable.Cell>Front end + database</FlowbiteTable.Cell>
                </FlowbiteTable.Row>
                <FlowbiteTable.Row>
                  <FlowbiteTable.Cell>Thinh (Felix) Nguyen</FlowbiteTable.Cell>
                  <FlowbiteTable.Cell>
                    Lead Software Engineer + Front end + Databases
                  </FlowbiteTable.Cell>
                </FlowbiteTable.Row>
              </FlowbiteTable.Body>
            </FlowbiteTable>
          </div>
        </div>
      </div>

      <p className="py-4 text-md italic font-semibold text-gray-500 dark:text-gray-400">
        Thanks to Brigham and Women's Hospital and their representative, Andrew
        Shinn.
      </p>
      <p
        className="text-center text-md italic font-semibold text-gray-500 dark:text-gray-400"
        style={{
          textWrap: "balance",
        }}
      >
        The Brigham & Women's Hospital maps and data used in this application
        are copyrighted and provided for the sole use of educational purposes.
      </p>
    </div>
  );
};

export { About };
