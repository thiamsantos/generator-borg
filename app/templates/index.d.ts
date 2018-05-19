declare module '<%= moduleName %>' {
    export = <%= camelModuleName %>;
}

declare namespace <%= camelModuleName %> {
    function main(): string;
}
