import tracer from "dd-trace";
tracer.init();// initialized in a different file to avoid hoisting.
tracer.use('express', {
    service: 'production-fe'
})
export default tracer;
