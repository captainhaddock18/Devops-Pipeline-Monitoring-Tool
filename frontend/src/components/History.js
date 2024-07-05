import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const History = () => {
  const [durations, setDurations] = useState([]);
  const [timestamp, setTimeStamp] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [jobName, setJobName] = useState('');
  const [jobInfo, setJobInfo] = useState(null);
  const [error, setError] = useState('');
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const d3Container = useRef(null);

  useEffect(() => {
    const checkAuth = () => {
      const username = sessionStorage.getItem('username');
      const apiToken = sessionStorage.getItem('apiToken');
      if (!username || !apiToken) {
        setRedirectToLogin(true);
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = sessionStorage.getItem('username');
    const apiToken = sessionStorage.getItem('apiToken');

    if (!username || !apiToken) {
      alert('Username or API token not found in session storage.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3010/get-history', {
        params: {
          username: username,
          apiToken: apiToken,
          jobName: jobName,
        },
      });

      if (response.data) {
        setJobInfo(response.data);
        setError('');
      } else {
        setError('Job not found');
        setJobInfo(null);
      }
    } catch (error) {
      console.error('Failed to fetch job history:', error);
      setError('Failed to fetch job history. Check console for details.');
      setJobInfo(null);
    }

    try {
      const response1 = await axios.get('http://localhost:3010/job-stats', {
        params: {
          username: username,
          apiToken: apiToken,
          jobName: jobName,
        },
      });

      if (response1.data) {
        const builds = response1.data.builds;
        setBuilds(builds);
        const durationValues = builds.map(build => build.duration);
        const timestampValues = builds.map(build => build.timestamp);
        const successCount = builds.filter(build => build.result === "SUCCESS").length;
        const failureCount = builds.length - successCount;
        const pieData = [
          { label: "Success", count: successCount },
          { label: "Failure", count: failureCount }
        ];
        setPieData(pieData);
        setTimeStamp(timestampValues);
        setDurations(durationValues);
        console.log("Fetched job successfully")
        setError('');
      } else {
        setError('Job not found');
        setBuilds(null);
        setTimeStamp(null);
        setDurations(null);
      }
    } catch (error) {
      console.error('Failed to fetch job history:', error);
      setError('Failed to fetch job history. Check console for details.');
      setBuilds(null);
      setTimeStamp(null);
      setDurations(null);
    }
  };
const AreaChart = ({ builds }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (builds.length > 0 && d3Container.current) {
      // Process all builds to include their timestamps and durations
      const data = builds.map(build => ({
        timestamp: new Date(build.timestamp),
        duration: build.duration,
      }));

      // Clear previous content
      d3.select(d3Container.current).html("");

      // Set dimensions and margins
      const margin = { top: 20, right: 30, bottom: 50, left: 50 };
      const width = d3Container.current.clientWidth - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Append SVG object
      const svg = d3.select(d3Container.current)
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // X scale and axis
      const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.timestamp))
        .range([0, width]);
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%m-%d %H:%M")))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      // Y scale and axis
      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.duration)])
        .range([height, 0]);
      svg.append("g")
        .call(d3.axisLeft(y));

      // Area generator
      const area = d3.area()
        .x(d => x(d.timestamp))
        .y0(height)
        .y1(d => y(d.duration));

      // Add the area path
      svg.append("path")
        .datum(data)
        .attr("fill", "lightblue")
        .attr("d", area);

      // Linear regression calculation
      const linearRegression = (data) => {
        const n = data.length;
        const sumX = d3.sum(data, d => d.timestamp.getTime());
        const sumY = d3.sum(data, d => d.duration);
        const sumXY = d3.sum(data, d => d.timestamp.getTime() * d.duration);
        const sumX2 = d3.sum(data, d => d.timestamp.getTime() * d.timestamp.getTime());

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return { slope, intercept };
      };

      const { slope, intercept } = linearRegression(data);

      // Line generator for regression line
      const regressionLine = d3.line()
        .x(d => x(d.timestamp))
        .y(d => y(slope * d.timestamp.getTime() + intercept));

      // Add the regression line path
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", regressionLine);

      // Tooltip
      const tooltip = d3.select(d3Container.current)
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "5px");

      // Add circles
      svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 4)
        .attr("cx", d => x(d.timestamp))
        .attr("cy", d => y(d.duration))
        .style("fill", "blue")
        .on("mouseover", (event, d) => {
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(`Timestamp: ${d3.timeFormat("%Y-%m-%d %H:%M:%S")(d.timestamp)}<br/>Duration: ${d.duration}`)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", (d) => {
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });

      // Event listeners for tooltip
      svg.on("mousemove", (event) => {
        const [mouseX, mouseY] = d3.pointer(event);
        const xDate = x.invert(mouseX);
        const bisect = d3.bisector(d => d.timestamp).left;
        const index = bisect(data, xDate, 1);
        // const d0 = data[index - 1];
        // const d1 = data[index];
        // const d = xDate - d0.timestamp > d1.timestamp - xDate ? d1 : d0;
        tooltip.style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px");
      });

    }
  }, [builds]);

  return (
    <div ref={d3Container} />
  );
};

const PieChart = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data && d3Container.current) {
      const renderPieChart = () => {
        const containerWidth = d3Container.current.clientWidth;
        const containerHeight = 450;

        const width = containerWidth;
        const height = containerHeight;
        const margin = 40;

        // Clear previous content
        d3.select(d3Container.current).html("");

        // Append SVG object
        const svg = d3.select(d3Container.current)
          .append("svg")
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("preserveAspectRatio", "xMinYMin meet")
          .append("g")
          .attr("transform", `translate(${width / 2},${height / 2})`);

        // Set the radius
        const radius = Math.min(width, height) / 2 - margin;

        // Set color scale
        const color = d3.scaleOrdinal()
          .domain(data.map(d => d.label))
          .range(d3.schemeCategory10);

        // Compute the position of each group on the pie
        const pie = d3.pie()
          .value(d => d.count);

        const data_ready = pie(data);

        // Shape helper to build arcs
        const arc = d3.arc()
          .innerRadius(0)
          .outerRadius(radius);

        // Build the pie chart
        svg.selectAll('path')
          .data(data_ready)
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', d => color(d.data.label))
          .attr("stroke", "white")
          .style("stroke-width", "2px")
          .style("opacity", 0.7);

        // Add labels
        svg.selectAll('text')
          .data(data_ready)
          .enter()
          .append('text')
          .text(d => `${d.data.label}: ${d.data.count} (${d3.format(".1%")(d.data.count / d3.sum(data, d => d.count))})`)
          .attr("transform", d => `translate(${arc.centroid(d)})`)
          .style("text-anchor", "middle")
          .style("font-size", 15);
      };

      renderPieChart();

      // Add resize event listener
      const handleResize = () => {
        renderPieChart();
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [data]);

  return (
    <div ref={d3Container} style={{ width: '100%' }} />
  );
};



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">Jenkins Job History</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700">Job Name:</label>
            <input
              type="text"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              required
              className="mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Get History
          </button>
        </form>
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        {jobInfo && durations && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              {/* <div>
                <h1>Job Durations</h1>
                <ul>
                {builds.map((build, index) => (
                  <li key={index}>
                    Build {index + 1}: Duration: {build.duration} ms, Timestamp: {new Date(build.timestamp).toLocaleString()}
                  </li>
                ))}
                </ul>
              </div> */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Job Information for {jobInfo.fullDisplayName}</h3>
            <p className="text-gray-700"><strong>Description:</strong> {jobInfo.description || 'No description'}</p>
            <p className="text-gray-700"><strong>URL:</strong> <a href={jobInfo.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{jobInfo.url}</a></p>
            <p className="text-gray-700"><strong>Buildable:</strong> {jobInfo.buildable ? 'Yes' : 'No'}</p>
            <h4 className="text-xl font-semibold text-gray-800 mt-4">Builds:</h4>
            <ul className="list-disc pl-6">
              {jobInfo.builds.map((build) => (
                <li key={build.number} className="text-gray-700">
                  Build #{build.number}: <a href={build.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{build.url}</a>
                </li>
              ))}
            </ul>
            <h4 className="text-xl font-semibold text-gray-800 mt-4">Health Report:</h4>
            {jobInfo.healthReport.map((report, index) => (
              <p key={index} className="text-gray-700">{report.description} (Score: {report.score})</p>
            ))}
            {jobInfo.lastSuccessfulBuild && (
              <p className="text-gray-700"><strong>Last Successful Build:</strong> <a href={jobInfo.lastSuccessfulBuild.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{jobInfo.lastSuccessfulBuild.url}</a></p>
            )}
            {jobInfo.lastCompletedBuild && (
              <p className="text-gray-700"><strong>Last Completed Build:</strong> <a href={jobInfo.lastCompletedBuild.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{jobInfo.lastCompletedBuild.url}</a></p>
            )}
            <h4 className="text-xl font-semibold text-gray-800 mt-4">Dashboard:</h4>
            <div>
              <div ref={d3Container} style={{ width: '100%', height: '100%' }}></div>
            </div>
            <div> 
              <p className="text-gray-700"><strong>Understanding Build Duration over time:</strong></p>
              <AreaChart builds={builds} />
            </div>
            <div> 
            <p className="text-gray-700"><strong>Understanding Build Results:</strong></p>
              <PieChart data={pieData} />
            </div>
          </div>
          
        )}
        
      </div>
    </div>
  );
};

export default History;
