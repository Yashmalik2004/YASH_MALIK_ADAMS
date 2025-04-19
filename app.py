from flask import Flask, render_template

app = Flask(__name__, template_folder='adams')

@app.route('/404')
def error_404():
    return render_template('404.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/admin-login')
def admin_login():
    return render_template('admin-login.html')

@app.route('/appointment')
def appointment():
    return render_template('appointment.html')

@app.route('/call-to-action')
def call_to_action():
    return render_template('call-to-action.html')

@app.route('/client')
def client():
    return render_template('client.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/facility')
def facility():
    return render_template('facility.html')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/medicine')
def medicine():
    return render_template('medicine.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/team')
def team():
    return render_template('team.html')

@app.route('/testimonial')
def testimonial():
    return render_template('testimonial.html')

@app.route('/underWork')
def under_work():
    return render_template('underWork.html')

if __name__ == '__main__':
    app.run(debug=True)
