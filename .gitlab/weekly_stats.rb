require 'net/http'
require 'uri'
require 'json'
require 'date'

GITLAB_API_TOKEN = ENV['GITLAB_API_KEY']
GITLAB_PROJECT_ID = 3225
GITLAB_API_URL = "https://gitlab.infomaniak.ch/api/v4"
NOTIFY_CHANNEL = ARGV[0]

def get_this_weeks_merge_requests
  uri = URI("#{GITLAB_API_URL}/projects/#{GITLAB_PROJECT_ID}/merge_requests?updated_after=#{(Time.now - 60 * 60 * 24 * 7).utc.strftime('%Y-%m-%dT%H:%M:%SZ')}")
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  request = Net::HTTP::Get.new(uri, { "PRIVATE-TOKEN" => GITLAB_API_TOKEN })
  response = http.request(request)
  JSON.parse(response.body)
end

def get_merge_request_notes(mr_iid)
  uri = URI("#{GITLAB_API_URL}/projects/#{GITLAB_PROJECT_ID}/merge_requests/#{mr_iid}/notes")
  response = Net::HTTP.get(uri)
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  request = Net::HTTP::Get.new(uri, { "PRIVATE-TOKEN" => GITLAB_API_TOKEN })
  response = http.request(request)
  JSON.parse(response.body)
end

def convert_time_to_seconds(time_string)
  time_string = time_string.downcase
  seconds = 0

  if time_string =~ /(\d+)w/
    seconds += $1.to_i * 604800  # 1 week = 7 days * 24 hours * 60 minutes * 60 seconds
  end

  if time_string =~ /(\d+)d/
    seconds += $1.to_i * 86400   # 1 day = 24 hours * 60 minutes * 60 seconds
  end

  if time_string =~ /(\d+)h/
    seconds += $1.to_i * 3600    # 1 hour = 60 minutes * 60 seconds
  end

  if time_string =~ /(\d+)m/
    seconds += $1.to_i * 60      # 1 minute = 60 seconds
  end

  if time_string =~ /(\d+)s/
    seconds += $1.to_i
  end

  seconds
end

def parse_time_spent(note)
  add_regex = /added (.*) of time spent(?: at (.*))?/i
  subtract_regex = /subtracted (.*) of time spent(?: at (.*))?/i
  remove_regex = /Removed time spent/i

  add_match = add_regex.match(note)
  if add_match
    puts convert_time_to_seconds(add_match[1])
    return convert_time_to_seconds(add_match[1]), add_match[2]
  end

  subtract_match = subtract_regex.match(note)
  if subtract_match
    return -convert_time_to_seconds(subtract_match[1]), subtract_match[2]
  end

  if remove_regex.match(note)
    return 0, nil
  end

  return nil, nil
end

def get_gitlab_issues
  uri = URI("#{GITLAB_API_URL}/projects/#{GITLAB_PROJECT_ID}/issues")
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  request = Net::HTTP::Get.new(uri, { "PRIVATE-TOKEN" => GITLAB_API_TOKEN })
  response = http.request(request)
  JSON.parse(response.body)
end

def notify_channel(message)
  uri = URI(NOTIFY_CHANNEL)
  request = Net::HTTP::Post.new(uri, { "Content-Type" => "application/json" })
  request.body = { "text" => message }.to_json
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  http.request(request)
end

def get_merge_request_activity(project_id, merge_request_iid)
  uri = URI.parse("#{GITLAB_API_URL}/projects/#{project_id}/merge_requests/#{merge_request_iid}/resource_state_events")
  request = Net::HTTP::Get.new(uri, { "PRIVATE-TOKEN" => GITLAB_API_TOKEN })
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  response = http.request(request)

  if response.code.to_i != 200
    puts "Failed to get merge request activity: #{response.body}"
    return []
  else
    return JSON.parse(response.body)
  end
end

def seconds_to_human_readable(total_seconds)
  units = {
    "w" => 7*24*60*60,
    "d" => 24*60*60,
    "h" => 60*60,
    "m" => 60,
  }

  result = []
  units.each do |unit, seconds|
    if total_seconds >= seconds
      amount = (total_seconds/seconds).floor
      total_seconds -= amount * seconds
      result << "#{amount}#{unit}" if amount > 0
    end
  end

  return result.join(' ')
end

def main
  merge_requests = get_this_weeks_merge_requests
  message = "#### Weekly summary:\n🚧  **Working on:**\n"

  merge_requests.each do |mr|
    total_time_spent = 0
    notes = get_merge_request_notes(mr['iid'])
    notes.each do |note|
      time_spent, _ = parse_time_spent(note['body'])
      puts mr['iid']
      # puts time_spent
      total_time_spent += time_spent if time_spent
    end
    # Skip to the next merge request if no time was spent
    next if total_time_spent == 0
    human_readable_time_spent = seconds_to_human_readable(total_time_spent)
    message += "- [#{mr['title']}](#{mr['web_url']}) #{human_readable_time_spent} @#{mr['author']['username']}\n"
  end

  issues = get_gitlab_issues
  important_issues = issues.select { |issue| issue['labels'].include?("❗️") }

  if important_issues.any?
    message += "\n❗️ **Blockers** (see issue discussion or trello)\n"
    important_issues.each do |issue|
      message += "- [#{issue['title']}]({issue['web_url']})"
      if issue['assignees'].any?
        assignee_usernames = issue['assignees'].map { |assignee| assignee['username'] }
        message += " (assigned to @#{assignee_usernames.join(', @')})"
      end
      message += "\n"
    end
  end

  puts message
  notify_channel(message)
end

main
