declare namespace BpmnJS {
       
    interface IToolManager {

        /**
         * Activate tool 
         * @param toolName {string} - Tool name
         */
        setActive(toolName: string): void;

        /**
         * Returns true if the given tool name is active
         * @param toolName {string} - Tool name
         * @return {boolean} true if given tool is active
         */
        isActive(toolName: string): boolean;

        /**
         * Activate tool 
         * @param toolName {string} - Tool name
         * @param events {any} - Required object with events
         */
        registerTool(toolName: string, events: any): void;

    }


}